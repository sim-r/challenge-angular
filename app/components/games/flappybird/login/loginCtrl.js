'use strict'

angular.module('app')
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/components/games/flappybird/login/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
    })

.controller('loginCtrl', ['$scope', 'localStorageService', loginCtrl])

function loginCtrl($scope, localStorageService) {
    var vm = this
	vm.login
    vm.isGameOn = vm.isGameOver = false
    vm.initGame = initGame
	vm.score = localStorageService.get('scoreHistory');

	if (!vm.score) {
		vm.score = [];
	}
	
    function initGame() {
        vm.isGameOn = true
    }    

    $scope.$on('game-end', function(targetScope, evt) {
		vm.score.push({'login': vm.login, 'score': evt})
        vm.isGameOver = true;
    })
}