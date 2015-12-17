class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :set_cache_headers
  protect_from_forgery with: :exception

  private

  def set_cache_headers
  	response.headers["Cache-Control"] = "no-cache, no-tore, max-age=0, must-revalidate"
  	response.headers["Pragma"] = "no-cache"
  	response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
end
