pipeline {
    agent {
        docker
    }

    triggers { pollSCM('* * * * *') }

    tools {
        nodejs "node"

        dockerTool "Docker"
    }

    stages {
        stage('Checkout') {

            steps {
                //Check out
                git branch: 'master', url: 'git@github.com:fredrickace/devcamp_CICD.git'
            }

        }

        stage('Docker Build Image') {
            steps {
                sh "docker build . -t fredrickcyril/devcamper:${env.BUILD_NUMBER}"
            }
        }

//         stage('Docker Compose') {
//             steps {
//                 sh "docker-compose up"
//             }
//         }
    }
}
