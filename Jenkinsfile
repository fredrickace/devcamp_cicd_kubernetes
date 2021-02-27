pipeline {
    agent any

    triggers { pollSCM('* * * * *') }

    tools {
        nodejs "node"


    }

    stages {
        stage('Checkout') {

            steps {
                //Check out
                git branch: 'master', credentialsId: 'Jenkins_Devcamper', url: 'git@github.com:fredrickace/Devcamp_Backend.git'
            }

        }
        environment {
              TOOL =  tool name: 'Docker', type: 'dockerTool'

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
}
