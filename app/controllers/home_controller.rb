class HomeController < ApplicationController
  before_action :skip_authorization, only: [:app]

  def app
  end
end
