Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'
  resources :users, only: [:show]
  resources :games do
  	resources :game_sessions, only: [:create, :destroy, :show]
  end	
  put '/continue/:id/:score' => 'games#update', as: :continue
end
