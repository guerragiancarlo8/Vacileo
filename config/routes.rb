Rails.application.routes.draw do
  devise_for :users
  get '/' => 'users#index'
  get '/users/:id' => 'users#index'
  get '/game/:id' => 'game#index'
  post '/save/:id' => 'game#save'
end
