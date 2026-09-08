pipeline {
    agent any

    stages {
        stage('Build Backend') {
            when {
                changeset "backend/**"
            }
            steps {
                sh '''
                cd backend
                npm ci
                npm run build
                '''
            }
        }

        stage('Build Frontend') {
            when {
                changeset "frontend/**"
            }
            steps {
                sh '''
                cd frontend
                npm ci
                npm run build
                '''
            }
        }

        stage('Docker Build') {
            when {
                anyOf {
                    changeset "backend/**"
                    changeset "frontend/**"
                }
            }
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