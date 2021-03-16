pipeline {

    environment {
        dockerImage = ''
    }
//     agent {
//       label 'docker'
//     }

    triggers { pollSCM('* * * * *') }


    stages {
        stage('Build & Push Docker Image') {
            agent {
                label 'docker'
            }

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
                    kubernetesDeploy(kubeconfigId: 'dev_camp_config', configs: "svc-nodeport.yml, svc-loadbalancer
                    .yml, deploy.yml")
                }
            }
        }
    }

}
