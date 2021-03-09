def dockerImage;

node('docker'){
	stage('SCM'){
		checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/fredrickace/devcamp_CICD.git']]]);
	}
	stage('build'){
		dockerImage = docker.build('fredrickcyril/devcamper:v$BUILD_NUMBER', '.');
	}
	stage('push'){
		docker.withRegistry('', 'docker_pwd'){
			dockerImage.push();
		}
	}
}