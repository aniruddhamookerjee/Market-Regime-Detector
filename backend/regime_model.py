from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from hmmlearn import hmm
import numpy as np

class RegimeDetector:
    def __init__(self, model_type="gmm", n_regimes=4):
        self.model_type = model_type.lower()
        self.n_regimes = n_regimes
        
        if self.model_type == "kmeans":
            self.model = KMeans(n_clusters=n_regimes, random_state=42)
        elif self.model_type == "gmm":
            self.model = GaussianMixture(
                n_components=n_regimes,
                covariance_type='full',
                reg_covar=1e-3,
                n_init=10,
                max_iter=200,
                random_state=42
            )
        elif self.model_type == "hmm":
            self.model = hmm.GaussianHMM(n_components=n_regimes, covariance_type="full", n_iter=100, random_state=42)
        else:
            raise ValueError("Unsupported model type. Choose from kmeans, gmm, hmm.")

    def fit_predict(self, X: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        if self.model_type == "kmeans":
            labels = self.model.fit_predict(X)
            distances = self.model.transform(X)
            min_dist = np.min(distances, axis=1)
            confidences = 1.0 - (min_dist / (np.max(distances, axis=1) + 1e-6))
            confidences = np.clip(0.5 + confidences * 0.5, 0.5, 1.0)
            
            probas = np.zeros((len(X), self.n_regimes))
            for i, l in enumerate(labels):
                probas[i, l] = confidences[i]
                rem = (1.0 - confidences[i]) / (self.n_regimes - 1)
                for j in range(self.n_regimes):
                    if j != l:
                        probas[i, j] = rem
            return labels, confidences, probas
            
        elif self.model_type == "gmm":
            self.model.fit(X)
            labels = self.model.predict(X)
            proba = self.model.predict_proba(X)
            confidences = np.max(proba, axis=1)
            return labels, confidences, proba
            
        elif self.model_type == "hmm":
            self.model.fit(X)
            labels = self.model.predict(X)
            proba = self.model.predict_proba(X)
            confidences = np.max(proba, axis=1)
            return labels, confidences, proba
