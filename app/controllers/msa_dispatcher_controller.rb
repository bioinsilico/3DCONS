class MsaDispatcherController < ApplicationController
  MVIEW = "/home/joan/apps/mview/bin/mview"
  PDB_PSSM_DB = "/home/joan/databases/pdb_pssm/"
  def dispatch_msa
    seq_id = params[ :seq_id ].to_s
    n_iter = ["2","3"]
    iter = n_iter[ params[ :iter ].to_i ]
    cmd = MVIEW+" -in blast  -out clustal "+PDB_PSSM_DB+"/iterNum"+iter+"/"+seq_id+".uniqSeq.fasta.step"+iter+".psi_out"
    clustal = `#{cmd}`
    clustal = clustal.gsub('UniRef100_', '')
    status = :ok
    render plain: clustal, status: status
  end
end
