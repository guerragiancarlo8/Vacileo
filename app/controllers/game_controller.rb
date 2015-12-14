class GameController < ApplicationController
	def index
		if user_signed_in?
			render 'show'+params[:id]
		else
			render 'index'+params[:id]
		end
	end

	def leaderboard

	end

	def save
		new_session = GameSession.create(user_id: current_user.id, game_id: params[:id], score: params[:score_obtained])
		redirect_to '/users/'+(current_user.id).to_s
	end
end
