class UsersController < ApplicationController
	def index
		if user_signed_in?
			#@games_played = Game.uniq.joins('JOIN game_sessions ON game_sessions.game_id = games.id').where("game_sessions.user_id = ?", current_user.id)
			@games_played = Game.joins(:game_sessions)
			render 'show'
		else
			render 'index'
		end
	end
end
