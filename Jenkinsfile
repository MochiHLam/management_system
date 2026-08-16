pipeline {
    agent any

    stages {
        stage('Build Backend') {
            steps {
                sh '''
                cd backend
                npm ci
                npm run build
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                cd frontend
                npm ci
                npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    file(
                        credentialsId: "backend-env-file",
                        variable: "BACKEND_ENV_FILE"
                    )
                ]){
                    sh '''
                    cp "$BACKEND_ENV_FILE" backend/.env
                    docker compose up -d
                    '''
                }
            }
        }
    }
    post {
        success {
            echo 'Project deployed successfully'
        }
        failure {
            echo 'Project deployment failed'
        }
    }
}