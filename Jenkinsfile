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
                script {

                    docker.withRegistry('', 'docker_pwd')
                    {

                        def customImage = docker.build("fredrickcyril/devcamper:${env.BUILD_NUMBER}")

                        /* Push the container to the custom Registry */
                        customImage.push()
                    }
                }
            }
        }
    }

}
