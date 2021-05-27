Rails.application.routes.draw do
  resources :leave_requests
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  root "home#app"
  match '*path', to: 'home#app', via: :all
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
