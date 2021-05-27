class LeaveRequestsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_leave_request, only: [:show, :update, :destroy]
  before_action -> { authorize_class(LeaveRequest) }, only: [:index, :create]


  def index
    if current_user.admin?
      @leave_requests = LeaveRequest.all
    else
      @leave_requests = LeaveRequest.where(user_id: current_user.id)
    end
    options = { include: %i[user] }
    render json: LeaveRequestSerializer.new(@leave_requests, options).serialized_json
  end

  def create
    @leave_request = LeaveRequest.new(leave_request_params)
    @leave_request.user = current_user
    if @leave_request.save
      options = { include: %i[user] }
      render json: LeaveRequestSerializer.new(@leave_request, options).serialized_json
    else
      render json: @leave_request.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @leave_request.destroy
  end

  def update
    if @leave_request.update(leave_request_params)
      options = { include: %i[user] }
      render json: LeaveRequestSerializer.new(@leave_request, options).serialized_json
    else
      render json: @leave_request.errors, status: :unprocessable_entity
    end
  end

  private

  def set_leave_request
    @leave_request = LeaveRequest.find(params[:id])
    authorize @leave_request
  end
  def leave_request_params
    params.require(:leave_request).permit(:title, :start, :end, :status)
  end
end
