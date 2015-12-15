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

end
