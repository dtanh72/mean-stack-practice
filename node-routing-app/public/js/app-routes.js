// Author: Anh Duong
// =======================================================

angular.module('routePath',['ngRoute'])
	
	.config(function($routeProvider, $locationProvider)
	{
		$routeProvider
			.when('/home', 
			{
				templateUrl: 'views/pages/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})
			
			.when('/about', 
			{
				templateUrl: 'views/pages/about.html',
				controller: 'aboutController',
				controllerAs: 'about'
			})
			
			.when('/contact', 
			{
				templateUrl: 'views/pages/contact.html',
				controller: 'contactController',
				controllerAs: 'contact'
			});
			
		// set our app up to have pretty URLS
		$locationProvider.html5Mode(true);
	});