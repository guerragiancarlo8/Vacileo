class GameSessionsController < ApplicationController
	def create
		new_session = GameSession.new(user_id: current_user.id, game_id: params[:game_id], score: params[:score_obtained])
		if new_session.save
			render :nothing => true, :status => :created
		end
	end

	def destroy
		session_to_destroy = GameSession.find_by(id: params[:id])
		session_to_destroy.destroy
		redirect_to user_path(current_user)
	end

	def update
		session_to_update = GameSession.find_by(id: params[:id])
		if session_to_update.update(:score => params[:score_obtained])
			render :nothing => true, :status => 200
		end
	end
end
