class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    raise Pundit::NotAuthorizedError, "must be logged in" unless user

    @user = user
    @record = record
  end

  def index?
    user_and_above?
  end

  def show?
    user_and_above?
  end

  def create?
    user_and_above?
  end

  def new?
    create?
  end

  def update?
    user_and_above?
  end

  def edit?
    update?
  end

  def destroy?
    user_and_above?
  end

  def self.permit_access_to_all_users(*actions)
    actions.each do |action|
      define_method("#{action}?") do
        user.present?
      end
    end
  end

  def self.permit_access_to_user_and_above(*actions)
    actions.each do |action|
      define_method("#{action}?") do
        user_and_above?
      end
    end
  end

  def self.permit_conditional_access(actions, options)
    actions.each do |action|
      define_method("#{action}?") do
        public_send(options[:if])
      end
    end
  end

  def user_and_above?
    user.user? || user.admin?
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      raise Pundit::NotAuthorizedError, "must be logged in" unless user

      @user = user
      @scope = scope
    end

    def user_and_above?
      ApplicationPolicy.new(user, nil).user_and_above?
    end

    def resolve
      scope.all
    end
  end
end
