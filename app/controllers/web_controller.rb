class WebController < ApplicationController
  PDB_PSSM_PATH = "/home/joan/databases/pdb_pssm/"
  PDB_PSSM_ZIP = PDB_PSSM_PATH+"pdbOut.zip"
  PDB_PSSM_DB = PDB_PSSM_PATH+"pdb_pssm.db"
  PDB_PSSM_PATH_CAMPINS = "/home/jsegura/databases/pdb_pssm/"

  require 'zip'
  require 'rubygems/package'

  def collect_files
    pdb_list = []
    if params[:pdb] && params[:pdb][:list]
      pdb_list.concat params[:pdb][:list].lines.map(&:chomp)
    end

    file_data = params[:file_list]
    if file_data.respond_to?(:read)
      file_content = file_data.read
      pdb_list.concat file_content.lines.map(&:chomp)
    else
       logger.error "Bad file_data: #{file_data.class.name}: #{file_data.inspect}"
    end

    pdb_collection = []
    pdb_list.each do |p|
      if p.length == 6
        x = p.split(":")
        pdb =  x[0].downcase
        ch =  x[1]
        pdb_collection.push( [pdb,ch] )
      else
        pdb_collection.push( [p.downcase,nil] )
      end
    end
    db = SQLite3::Database.new PDB_PSSM_DB
    pdb_to_id = {}
    n_files = 0
    pdb_collection.each do |p|
      ch_ = ";"
      if !p[1].nil?
        ch_ = " and chain=\"#{p[1]}\";"
      end
      if pdb_to_id[p[0]].nil?
        pdb_to_id[p[0]] = {}
      end
      db.execute( "select * from pdbsTable where pdb=\"#{p[0]}\""+ch_ ) do |r|
        pdb_to_id[ p[0] ][ r[1] ] = { 'seq_id'=>r[2] }
        pdb_to_id[ p[0] ][ r[1] ]['statuts'] = {}
        db.execute( "select stepNum,status from pssmsTableUniref100 where seqId = #{r[2]};" ) do |s|
          pdb_to_id[ p[0] ][ r[1] ]['statuts'][s[0]] = s[1]
          n_files += 1
        end
      end
    end

    file_string = ""
    pdb_to_id.each do |p,x|
      x.each do |c,y|
        [2,3].each do |i|
          if pdb_to_id[ p ][ c ]['statuts'][i] == 0
            file_string += "pssm/"+p+"_"+c+"_"+i.to_s+".pssm.gz\\n" 
          end
        end
      end
    end
    file_string = file_string.chop.chop
    cmd = "printf \""+file_string+"\" | tar -h -c -f - -C "+PDB_PSSM_PATH+" -T -"
    binary_data = `#{cmd}`

    cookies[:download_start] = true
    send_data(binary_data, :type => 'application/tar', :filename => "pssm_files.tar")
  end
end
