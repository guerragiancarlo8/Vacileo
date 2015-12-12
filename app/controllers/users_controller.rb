class UsersController < ApplicationController
	def index
		render 'index'
	end

	def user_page
		@user = User.find_by(params[:id]);

	end
end
