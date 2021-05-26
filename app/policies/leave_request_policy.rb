class LeaveRequestPolicy < ApplicationPolicy
  permit_access_to_user_and_above :index, :destroy, :update, :show
end
