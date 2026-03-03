# AI Travel Decision Engine

AI-powered group travel recommendation system using a full stack + ML microservice architecture.

Collaborative group sessions allow users to share travel preference information and budget constraints. The system processes structured feature vectors and returns a list of recommended destinations based on a ranking algorithm.

**System Architecture**
<img width="829" height="417" alt="image" src="https://github.com/user-attachments/assets/87848a31-0937-4c09-a6f8-3ffd19495ce4" />



**Technology Stack**

Next.js (TypeScript)

Prisma + PostgreSQL (Neon)

FastAPI ML microservice

Scikit-Learn (KMeans, StandardScaler)

Cosine Similarity

Hyperparameter Tuning (Silhouette Score)

**Machine Learning Approach**

Multi-hot encoded destination feature vectors

Feature Scaling using StandardScaler

Automatic K Selection (2-6) using Silhouette Score

Budget-aware hybrid ranking approach

**Optimal Clustering Configuration**

K = 5

Silhouette Score: ~0.36
