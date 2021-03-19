pipeline {

    environment {
        dockerImage = ''
        APP_MAJOR_VERSION = "alpha"
        APP_MINOR_VERSION = "1"
        APP_FULL_VERSION = getAppVersion()
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

                        sh "chmod +x changeVersion.sh"
                        sh "./changeVersion.sh ${env.APP_FULL_VERSION}"
                        script {

                            docker.withRegistry('', 'docker_pwd')
                            {

                                dockerImage = docker.build("""fredrickcyril/devcamper_testing:${env.APP_FULL_VERSION}""")

                                /* Push the container to the custom Registry */
                                dockerImage.push()

                                dockerImage.push('latest')
                            }
                        }
                    }
                }

                stage('Remove local images') {
                    steps {

                        sh "docker rmi fredrickcyril/devcamper_testing:${env.APP_FULL_VERSION}"

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
                        sh "./changeTag.sh ${env.APP_FULL_VERSION}"

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
                slackSend channel: 'builds', message: "Build V:${env.APP_FULL_VERSION} aborted. \n ${env.GIT_COMMIT_MSG}"
          }
          success {
                slackSend channel: 'builds', message: "Build V:${env.APP_FULL_VERSION} Success"

          }
          failure {
                slackSend channel: 'builds', message: "Build V:${env.APP_FULL_VERSION} Failure"

          }
          unsuccessful {
                slackSend channel: 'builds', message: "Build V:${env.APP_FULL_VERSION} unsuccessful"

          }
        }
}

def getAppVersion() {
    return "${env.APP_MAJOR_VERSION}.${env.APP_MINOR_VERSION}.${env.BUILD_NUMBER}"
}
