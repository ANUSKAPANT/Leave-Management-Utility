class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :email, :role, :first_name, :last_name
end
