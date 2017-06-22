class PssmJsonController < ApplicationController

  require 'net/http'

  PDB_PSSM_PATH = "/home/joan/databases/pdb_pssm/"
  PDB_PSSM_ZIP = PDB_PSSM_PATH+"pdbOut.zip"
  PDB_PSSM_DB = PDB_PSSM_PATH+"pdb_pssm.db" 
  EBI_RES_LISTING_URL = "https://www.ebi.ac.uk/pdbe/api/pdb/entry/residue_listing/"
  PDB_PSSM_PATH_CAMPINS = "/home/jsegura/databases/pdb_pssm/"

  def pssm_ch_rest
    pdb = params[:pdb].downcase
    chain =  params[:ch]
    alignment = res_alignment(pdb)    

    pdb_description  =  {}
    db = SQLite3::Database.new PDB_PSSM_DB
    db.execute( "select * from pdbsTable where pdb=\"#{pdb.downcase}\" and chain=\"#{chain}\"" ) do |r|
      pdb_description[ r[1] ] = []
      statuts = [0,0]
      db.execute( "select stepNum,status from pssmsTableUniref100 where seqId = #{r[2]};" ) do |s|
        statuts[ s[0]-2 ] = s[1]
      end
      if statuts[0] == 0
        x, y = get_pssm(r[2].to_s,"2",alignment[ r[1] ])
        x.each_with_index do |value,index|
          z = value
          z['iter'] = {2=>y[index]}
          pdb_description[ r[1] ].push(z)
        end
      end
      if statuts[1] == 0
        x, y = get_pssm(r[2].to_s,"3",alignment[ r[1] ])
        y.each_with_index do |value,index|
          pdb_description[ r[1] ][index]['iter'][3]=value
        end
      end
    end
    return render :json => pdb_description[chain]
  end

  def pssm_rest
    pdb = params[:pdb].downcase
    alignment = res_alignment(pdb)    

    pdb_description  =  {}
    db = SQLite3::Database.new PDB_PSSM_DB
    db.execute( "select * from pdbsTable where pdb=\"#{pdb.downcase}\";" ) do |r|
      pdb_description[ r[1] ] = []
      statuts = [0,0]
      db.execute( "select stepNum,status from pssmsTableUniref100 where seqId = #{r[2]};" ) do |s|
        statuts[ s[0]-2 ] = s[1]
      end
      if statuts[0] == 0
        x, y = get_pssm(r[2].to_s,"2",alignment[ r[1] ])
        x.each_with_index do |value,index|
          z = value
          z['iter'] = {2=>y[index]}
          pdb_description[ r[1] ].push(z)
        end
      end
      if statuts[1] == 0
        x, y = get_pssm(r[2].to_s,"3",alignment[ r[1] ])
        y.each_with_index do |value,index|
          pdb_description[ r[1] ][index]['iter'][3]=value
        end
      end
    end
    return render :json => pdb_description
  end

  def get_pssm(seq_id,n,alignment)
    #cmd = "unzip -p "+PDB_PSSM_ZIP+" pdbOut/iterNum"+n+"/"+seq_id+".step"+n+".pssm"
    cmd ="ssh jsegura@campins \"cat "+PDB_PSSM_PATH_CAMPINS+"/pdbOut/iterNum"+n+"/"+seq_id+".step"+n+".pssm\""
    file = `#{cmd}`
    out_res = []
    out_scores = [] 
    file.split("\n").each do |l|
      if l =~ /^(\s+)(\d)/
        r = l.split(/\s+/)
        n = r[1].to_i-1
        res_id = nil
        if !alignment['align'][n].nil?
          res_id = alignment['align'][n]
        end
        out_res.push( {'index'=>r[1].to_i, 'res_id'=>res_id,'aa'=>r[2] } )
        out_scores.push( {'pssm'=>r[3..22], 'psfm'=>r[23..42], 'a'=>r[43], 'b'=>r[44] } )
      end
    end
    return out_res,  out_scores
  end

  def res_alignment(pdb)
    url = EBI_RES_LISTING_URL+pdb
    begin
      data = Net::HTTP.get_response(URI.parse(url)).body
    rescue
      puts "Error downloading data:\n#{$!}"
    end
    mapping = {  }
    ali = JSON.parse(data)
    ali[pdb]['molecules'].each do |m|
      m['chains'].each do |c|
        if mapping[ c['chain_id'] ].nil?
           mapping[ c['chain_id'] ] = {'align'=>[], 'inverse'=>{}}
        end
        c['residues'].each do |r|
          mapping[ c['chain_id'] ]['align'].push(r['author_residue_number'].to_i)
          mapping[ c['chain_id'] ]['inverse'][ r['author_residue_number']  ] = mapping[ c['chain_id'] ]['align'].length-1
        end 
      end
    end
    return mapping
  end
end
