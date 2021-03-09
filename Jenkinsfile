pipeline {

    environment {
        dockerImage = ''
    }
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
                script {

                    docker.withRegistry('', 'docker_pwd')
                    {

                        dockerImage = docker.build("fredrickcyril/devcamper:${env.BUILD_NUMBER}")

                        /* Push the container to the custom Registry */
                        dockerImage.push()

                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

}
