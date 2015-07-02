// Author: Anh Duong
// =========================================================

angular.module('appRoute', ['routePath'])

	.controller('mainController', function()
	{
		var viewModel = this;
		
		viewModel.message = 'THIS IS MAIN CONTROLLER.';
	})
	
	.controller('homeController', function()
	{
		var viewModel = this;
		
		viewModel.message = 'THIS IS HOME CONTROLLER';
	})
	
	.controller('aboutController', function()
	{
		var viewModel = this;
		
		viewModel.message = 'THIS IS ABOUT CONTROLLER';
	})
	
	.controller('contactController', function()
	{
		var viewModel = this;
		
		viewModel.message = 'THIS IS CONTACT CONTROLLER';
	});