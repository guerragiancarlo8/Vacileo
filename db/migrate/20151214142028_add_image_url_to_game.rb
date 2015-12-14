class AddImageUrlToGame < ActiveRecord::Migration
  def change
  	add_column(:games, :url, :string);
  end
end
