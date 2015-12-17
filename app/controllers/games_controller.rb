class GamesController < ApplicationController
	@@previous_score = 0

	def show
		#@leaderboard = Game.find(params[:id]).game_sessions.select("user_id", "score").order("score DESC").limit(10)
		sql = "SELECT users.email, game_sessions.score FROM users JOIN game_sessions ON users.id = game_sessions.user_id where game_sessions.game_id = "+params[:id]+" ORDER BY score DESC"
		@leaderboard = ActiveRecord::Base.connection.execute(sql)
		if user_signed_in?
			render 'show'+params[:id]
		else
			render 'index'+params[:id]
		end
	end

	def update
		sql = "SELECT users.email, game_sessions.score FROM users JOIN game_sessions ON users.id = game_sessions.user_id where game_sessions.game_id = "+params[:game_id]+" ORDER BY score DESC"
		@leaderboard = ActiveRecord::Base.connection.execute(sql)
		@score = params[:score]
		@session = params[:session_id]
		@user = current_user.id
		render 'show'+params[:game_id]
	end

end
