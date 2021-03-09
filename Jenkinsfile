pipeline {
    agent {
      label 'docker'
    }

    triggers { pollSCM('* * * * *') }
`
//     tools {
//         nodejs "node"
//
//         dockerTool "Docker"
//     }

    stages {
        stage('Checkout') {

            steps {
                //Check out
                git branch: 'main', credentialsId: 'git_fredrick', url: 'https://github.com/fredrickace/devcamp_CICD.git'
            }

        }

        stage('Docker Build Image') {
            steps {
                sh "docker build . -t fredrickcyril/devcamper:${env.BUILD_NUMBER}"
            }
        }

        stage('Docker Push') {
            steps {
                sh "docker push fredrickcyril/devcamper:${env.BUILD_NUMBER}"
            }
        }

//         stage('Docker Compose') {
//             steps {
//                 sh "docker-compose up"
//             }
//         }
    }
}
