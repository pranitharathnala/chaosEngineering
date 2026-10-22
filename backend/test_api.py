import unittest
import json
import time
from datetime import datetime
from app import create_app
from chaos_engine import ChaosEngine

class ChaosResilienceTask4TestCase(unittest.TestCase):
    def setUp(self):
        self.engine = ChaosEngine()
        self.app = create_app(self.engine)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_root_endpoint(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('service'), 'ChaosResilience')
        self.assertEqual(data.get('status'), 'running')

    def test_health_endpoint(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertEqual(data.get('service'), 'ChaosResilience')
        self.assertIn('timestamp', data)

    def test_system_status_endpoint(self):
        response = self.client.get('/api/status')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['application']['status'], 'healthy')
        self.assertEqual(data['container']['status'], 'running')
        self.assertEqual(data['healthCheck']['status'], 'healthy')
        self.assertEqual(data['recovery']['status'], 'enabled')

    def test_metrics_initial_state(self):
        response = self.client.get('/api/metrics')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('experimentsExecuted'), 0)
        self.assertEqual(data.get('successfulRecoveries'), 0)
        self.assertIsNone(data.get('recoverySuccessRate'))
        self.assertIsNone(data.get('averageRecoveryTime'))

    def test_experiments_initial_state(self):
        response = self.client.get('/api/experiments')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('experiments'), [])

    def test_current_experiment_initial(self):
        response = self.client.get('/api/experiments/current')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('state'), 'IDLE')
        self.assertIsNone(data.get('experiment'))

    def test_stop_experiment_end_to_end(self):
        # 1. Trigger Stop experiment
        response = self.client.post('/api/experiments/stop')
        self.assertEqual(response.status_code, 202)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'RUNNING')
        self.assertIn('experimentId', data)

        # 2. Wait 0.8s for failure injection
        time.sleep(0.8)
        current = self.client.get('/api/experiments/current').get_json()
        self.assertIn(current.get('state'), ['RUNNING', 'FAILURE_DETECTED', 'RECOVERING'])
        
        # Verify /health fails during failure window
        if not self.engine.is_healthy:
            health_res = self.client.get('/health')
            self.assertEqual(health_res.status_code, 503)

        # 3. Wait for automated recovery to complete (total cycle ~3.2s)
        time.sleep(2.8)
        
        # 4. Verify system is restored
        current_recovered = self.client.get('/api/experiments/current').get_json()
        self.assertEqual(current_recovered.get('state'), 'RECOVERED')
        
        health_final = self.client.get('/health')
        self.assertEqual(health_final.status_code, 200)
        
        # 5. Verify real metrics
        metrics = self.client.get('/api/metrics').get_json()
        self.assertEqual(metrics.get('experimentsExecuted'), 1)
        self.assertEqual(metrics.get('successfulRecoveries'), 1)
        self.assertEqual(metrics.get('recoverySuccessRate'), 100.0)
        self.assertIsNotNone(metrics.get('averageRecoveryTime'))

        # 6. Verify experiment history record
        history = self.client.get('/api/experiments').get_json()
        self.assertEqual(len(history.get('experiments')), 1)
        exp = history['experiments'][0]
        self.assertEqual(exp.get('experiment'), 'Container Stop')
        self.assertEqual(exp.get('status'), 'RECOVERED')
        self.assertIn('s', exp.get('detectionTime'))
        self.assertIn('s', exp.get('recoveryTime'))

    def test_kill_experiment_end_to_end(self):
        # 1. Trigger Kill experiment
        response = self.client.post('/api/experiments/kill')
        self.assertEqual(response.status_code, 202)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'RUNNING')

        # 2. Wait for completion (~3.3s)
        time.sleep(3.5)
        
        # 3. Verify state and history
        current = self.client.get('/api/experiments/current').get_json()
        self.assertEqual(current.get('state'), 'RECOVERED')
        
        history = self.client.get('/api/experiments').get_json()
        self.assertEqual(len(history.get('experiments')), 1)
        exp = history['experiments'][0]
        self.assertEqual(exp.get('experiment'), 'Container Kill')
        self.assertEqual(exp.get('status'), 'RECOVERED')

    def test_conflict_when_already_running(self):
        # Trigger first experiment
        self.client.post('/api/experiments/stop')
        # Attempt second experiment concurrently
        response = self.client.post('/api/experiments/kill')
        self.assertEqual(response.status_code, 409)
        data = response.get_json()
        self.assertIn('error', data)

    def test_404_error_handler(self):
        response = self.client.get('/invalid-endpoint')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.content_type, 'application/json')
        data = response.get_json()
        self.assertEqual(data.get('error'), 'Resource not found')

if __name__ == '__main__':
    unittest.main()
