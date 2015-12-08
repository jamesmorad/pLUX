#!/usr/bin/env ipython	
import EvtReader_PyMod
import RQReader_PyMod           
import GetPodOverlaps_PyMod		
import numpy as np				
import random
import glob
import os
import fnmatch
import math
import matplotlib.pyplot as plt

def rand_pulse_area_phe(pulse_area):
  my_list = ['A'] * 4 + ['B'] * 24 + ['C'] * 24 + ['D']*24 + ['E']*24
  pa_bin = random.choice(my_list)
  if pulse_area < 2:
    bin_better_be = 'A'
  elif pulse_area >=2 and pulse_area < 50:
    bin_better_be = 'B'
  elif pulse_area >=50 and pulse_area < 500:
    bin_better_be = 'C'
  elif pulse_area >=500 and pulse_area < 2000:
    bin_better_be = 'D'
  elif pulse_area >= 2000 and pulse_area < 50000:
    bin_better_be = 'E'
  else:
    bin_better_be = 'F'

  if bin_better_be == pa_bin:
    we_good = True
  else:
    we_good = False
  return we_good

def get_rand_sumpod(evt_dir_path,rq_dir_path):

  #Check if we have a 1-to-1 match up of evts and rqs otherwise this may be trouble
  if len(glob.glob(evt_dir_path+"/*.evt")) != len(glob.glob(rq_dir_path+"/*.rq")):
    return None

  #find a random evt file in the directory and choose that to grab our event from
  file_list = glob.glob(evt_dir_path+"/*.evt")
  rand_file = random.choice(file_list)
  evt_filename = os.path.basename(rand_file)
  filename_prefix = evt_filename.split("_")[0]+"_"+evt_filename.split("_")[1]
  evt_filenumber = evt_filename.split("_")[2]

  #open evt file
  ereader = EvtReader_PyMod.EvtReader(rand_file, filematch = '*.evt', max_channel = 121, debug=True,pmt_gain_file="/data/3/DatasetsForPLUX/pmt_gains_9355.xml")

  #choose random event number and read that dictionary in
  evt_num = random.randrange(0,ereader.evt_number)	
  edict1 = ereader[evt_num]

  rq_files = glob.glob(rq_dir_path+"/*.rq")
  pattern = "*"+evt_filenumber+"*"
  rq_file = fnmatch.filter(rq_files,pattern)[0]
  rqreader = RQReader_PyMod.ReadRQFile(rq_file)
  random_pulse = random.randrange(0,10)
  pulse_start_samples = rqreader[0]['pulse_start_samples'][evt_num][random_pulse]
  pulse_end_samples = rqreader[0]['pulse_end_samples'][evt_num][random_pulse]
  luxstamp_samples = rqreader[0]['luxstamp_samples'][evt_num]
  pulse_area_phe = rqreader[0]['pulse_area_phe'][evt_num][random_pulse]
  aft_width = rqreader[0]['aft_t2_samples'][evt_num][random_pulse] - rqreader[0]['aft_t0_samples'][evt_num][random_pulse]
  peak_area_phe = rqreader[0]['peak_area_phe'][evt_num][random_pulse]
  while pulse_start_samples == 999999 or not rand_pulse_area_phe(pulse_area_phe):
    random_pulse = random.randrange(0,10)
    pulse_start_samples = rqreader[0]['pulse_start_samples'][evt_num][random_pulse]
    pulse_end_samples = rqreader[0]['pulse_end_samples'][evt_num][random_pulse]
    luxstamp_samples = rqreader[0]['luxstamp_samples'][evt_num]
    pulse_area_phe = rqreader[0]['pulse_area_phe'][evt_num][random_pulse]
    aft_width = rqreader[0]['aft_t2_samples'][evt_num][random_pulse] - rqreader[0]['aft_t0_samples'][evt_num][random_pulse]
    peak_area_phe = rqreader[0]['peak_area_phe'][evt_num][random_pulse]

 
  aft_width = "{0:.2f}".format(10*aft_width)
  pulse_area_phe = "{0:.2f}".format(pulse_area_phe)

  peak_area_phe = peak_area_phe.clip(0)
  peak_area_phe = [x/peak_area_phe.max() for x in peak_area_phe]
  peak_area_phe  = list(peak_area_phe)
  # Get the indicies 
  pulsestarts, pulseends, pulsechannels, pulseindecies = GetPodOverlaps_PyMod.GetPodOverlaps(edict1['pulse_starts'][0], edict1['pulse_lengths'][0], channels = edict1['active_channels'][0], total_tpc_pmts=122)

  sumpods = []
  pod_starts = []
  pulse_num = pulsestarts.size
  pods_array = []
  for i in range(pulse_num):    # step over pulses

    sumpod = np.zeros(pulseends[i] - pulsestarts[i], dtype=np.float64)
    indi_pods = np.zeros(pulseends[i] - pulsestarts[i], dtype=np.float64)
    currentind = 0
    for j in range(pulseindecies[i].size):
      # step over the PODs making up a pulse
      inii = edict1['pulse_starts'][0][pulsechannels[i][j]][pulseindecies[i][j]]-pulsestarts[i]
      inilens = edict1['pulse_lengths'][0][pulsechannels[i][j]][pulseindecies[i][j]]

      if pulseindecies[i][j] == 0:
        startind = 0
      else:
        startind = edict1['pulse_lengths'][0][pulsechannels[i][j]][:pulseindecies[i][j]].sum()

      finalind = edict1['pulse_lengths'][0][pulsechannels[i][j]][:pulseindecies[i][j]+1].sum()
      sumpod[inii:inii+inilens] += edict1['pulse_data'][0][pulsechannels[i][j]][startind:finalind]
      indi_pods = edict1['pulse_data'][0][pulsechannels[i][j]]
      pods_array.append(indi_pods)
    sumpods.append(sumpod)
    del sumpod
    del indi_pods
  
  pulse_width = pulse_end_samples-pulse_start_samples

  for i in range(edict1['active_channels'][0].size): # step over each PMT channel
      plt.plot(edict1['pulse_time_arr'][0][i], edict1['pulse_data'][0][i])
  plt.savefig("/var/www/FlaskApp/FlaskApp/static/james_is_lazy.png")


  times = []
  for pulseE,pulseS in zip(pulseends,pulsestarts):
    times.append(np.arange(pulseE-pulseS)+pulseS)


  summed_pod = []
  indiv_pods = []
  time_axis = []
  for time,pod in zip(np.hstack(times),np.hstack(sumpods)):
    if time >= pulse_start_samples-math.floor(0.1*pulse_width) and time <= pulse_end_samples+math.floor(0.1*pulse_width):
      time_axis.append(10*(time-pulse_start_samples))
      summed_pod.append(pod)

  data_dict = dict()
  data_dict["times"] = time_axis
  data_dict["pulse"] = summed_pod
  data_dict["filename_prefix"] = filename_prefix
  data_dict["filenumber"] = evt_filenumber
  data_dict["pulse_start_samples"] = pulse_start_samples
  data_dict["pulse_end_samples"] = pulse_end_samples
  data_dict["event_number"] = evt_num
  data_dict["pulse_area_phe"] = pulse_area_phe
  data_dict["peak_area_phe"] = peak_area_phe
  data_dict["aft_width"] = aft_width
  data_dict["luxstamp_samples"] = luxstamp_samples


  return data_dict
