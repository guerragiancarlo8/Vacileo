class UsersController < ApplicationController
	before_filter :set_cache_headers
	def show
		#games_played = Game.uniq.joins('JOIN game_sessions ON game_sessions.game_id = games.id').where("game_sessions.user_id = ?", current_user.id)
		#@games_played = Game.joins(:game_sessions)
		@games_played = current_user.game_sessions.order("score DESC").distinct.distinct(true)
	end
end
