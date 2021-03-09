pipeline {
    agent {
      label 'docker'
    }

    triggers { pollSCM('* * * * *') }


    stages {
        stage('Checkout') {

            steps {
                //Check out
                git branch: 'main', credentialsId: 'git_fredrick', url: 'https://github.com/fredrickace/devcamp_CICD.git'
            }

        }

        stage('Docker Build Image') {
            steps {

            docker.withRegistry('', 'docker_pwd') {

                def customImage = docker.build("fredrickcyril/devcamper:${env.BUILD_NUMBER}")

                /* Push the container to the custom Registry */
                customImage.push()
            }
//                 sh "docker login $env:docker_pwd"
//                 sh "docker build . -t fredrickcyril/devcamper:${env.BUILD_NUMBER}"
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
