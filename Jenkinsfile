pipeline {

    environment {
        dockerImage = ''
    }
    agent any
//     agent {
//       label 'docker'
//     }

    triggers { pollSCM('* * * * *') }


    stages {

    stage('get_commit_msg') {
        steps {
            script {
                env.GIT_COMMIT_MSG = sh (script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
            }
        }
    }
        stage('Build & Push Docker Image') {
            agent {
                label 'docker'
            }

            stages {

                stage('Docker Build Image') {
                    steps {
                        script {

                            docker.withRegistry('', 'docker_pwd')
                            {

                                dockerImage = docker.build("fredrickcyril/devcamper_testing:${env.BUILD_NUMBER}")

                                /* Push the container to the custom Registry */
                                dockerImage.push()

                                dockerImage.push('latest')
                            }
                        }
                    }
                }

                stage('Remove local images') {
                    steps {

                        sh "docker rmi fredrickcyril/devcamper_testing:${env.BUILD_NUMBER}"

                        sh "docker rmi fredrickcyril/devcamper_testing:latest"

                    }
                }
            }
        }

        stage('Deploy in Kuberenetes') {
            agent{
                label 'kubepod'
            }

            stages {
                stage('Deploy'){
                    steps {

                        sh "chmod +x changeTag.sh"
                        sh "./changeTag.sh ${env.BUILD_NUMBER}"
                        cat "deploy_latest.yml"

                       script {
                           kubernetesDeploy(kubeconfigId: 'dev_camp_config', configs: """svc-nodeport.yml,
                           svc-loadbalancer.yml, deploy_latest.yml""")
                       }
                    }
                }
            }
        }
    }

    post {
          aborted {
                slackSend channel: 'builds', message: "Build V:alpha1.${env.BUILD_NUMBER} aborted. \n ${env.GIT_COMMIT_MSG}"
          }
          success {
                slackSend channel: 'builds', message: "Build V:alpha1.${env.BUILD_NUMBER} Success"

          }
          failure {
                slackSend channel: 'builds', message: "Build V:alpha1.${env.BUILD_NUMBER} Failure"

          }
          unsuccessful {
                slackSend channel: 'builds', message: "Build V:alpha1.${env.BUILD_NUMBER} unsuccessful"

          }
        }

}
