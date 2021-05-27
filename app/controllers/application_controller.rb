
class ApplicationController < ActionController::Base
  respond_to :html, :json
  before_action :authenticate_user!
  include Pundit
  protect_from_forgery
  after_action :verify_authorized
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    render json: { error: 'Unauthorized', message: "You are not authorized to perform this action." }, status: :forbidden
  end

  def authorize_class(klass)
    authorize klass
  end
end

