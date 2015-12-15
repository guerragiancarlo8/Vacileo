class GamesController < ApplicationController
	@@previous_score = 0

	def show
		@leaderboard = Game.find(params[:id]).game_sessions.select("user_id", "score").order("score DESC")
		if user_signed_in?
			render 'show'+params[:id]
		else
			render 'index'+params[:id]
		end
	end

	def update
		#replace the previous gamestate with new gamestate
		@selected_game = Game.find(params[:id]).game_sessions.select("score").where(score: params[:score])
=begin
		if(@@previous_score < @selected_game.pluck(:score)[0])
			session_to_destroy = GameSession.find_by(game_id: params[:id], score: @@previous_score)
			session_to_destroy.destroy
		end
=end
		@@previous_score = @selected_game.pluck(:score)[0]
		@leaderboard = Game.find(params[:id]).game_sessions.select("user_id", "score").order("score DESC")
		render 'show'+params[:id]
	end

end
