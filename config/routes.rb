Rails.application.routes.draw do
  devise_for :users
  get '/' => 'users#index'
  get '/users/:id' => 'users#user_page'
  get '/game' => 'game#index'
end
