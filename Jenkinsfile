pipeline {
    agent any

    triggers { pollSCM('* * * * *') }

    tools {
        nodejs "node"

        tool name: 'Docker', type: 'dockerTool'
    }

    stages {
        stage('Checkout') {

            steps {
                //Check out
                git branch: 'master', credentialsId: 'Jenkins_Devcamper', url: 'git@github.com:fredrickace/Devcamp_Backend.git'
            }

        }

        stage('Docker Build Image') {
            steps {
                sh "docker build . -t devcamper"
            }
        }

        stage('Docker Compose') {
            steps {
                sh "docker-compose up"
            }
        }
    }
}
