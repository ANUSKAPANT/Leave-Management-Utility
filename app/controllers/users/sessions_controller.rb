# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :skip_authorization

  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
  end
end
