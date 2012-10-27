<!DOCTYPE html>

<html lang="en">
<head>
<head>
	<script src="<?php echo base_url() . "js/jquery-1.8.2.min.js"; ?>" type="text/javascript"></script>
	<script src="<?php echo base_url() . "js/nestphp.js"; ?>" type="text/javascript"></script>
	<link href="<?php echo base_url() . "css/style.css"; ?>" rel="stylesheet" type="text/css" />
	<script type="text/javascript">
		var base_url = '<?php echo base_url(); ?>';
		$(document).ready(function(){onLoad();});
	</script>

    <meta charset="utf-8" />
    <title>Nest Manager</title>
</head>
<body>

<div id="container">
	<?php
	foreach($structs as $struct_id => $struct)
	{
		?>
		<div class="structContainer" style="margin-top: 150px;">	
			<div class="structContainerLeft">
				<img class="structIcon" src="<?php echo base_url() . "images/House3.png"; ?>" />
				<div class="structInfoContainer" id="struct_info_<?php echo $struct_id; ?>">
					<?php 
					$awayString = "";
					if($struct['structure']['away'])
					{
						$awayString = ' (Away)';
					}
					?>
					<div class="structName"><?php echo $struct['structure']['name'] . $awayString; ?></div>
					<div class="structLocation"><?php echo $struct['structure']['location']; ?></div>
				</div>
			</div>
			<div class="structContainerRight">
				<?php
				foreach($devices as $device_id => $device)
				{
					$struct_id_parts = explode('.', $device['link']['structure']);
					$device_struct_id = $struct_id_parts[1];
					if($device_struct_id != $struct_id) continue;

					$containerType = 'Plain';
					if($device['shared']['hvac_heater_state'])
					{
						$containerType = 'Warming';
					}
					else if($device['shared']['hvac_ac_state'])
					{
						$containerType = 'Cooling';
					}
					?>
					<div class="deviceContainer container<?php echo $containerType; ?>" id="device_<?php echo $device_id; ?>">
						<div class="innerContainer">
							<div class="topContainer topContainer<?php echo $containerType; ?>">
								<div class="deviceName deviceName<?php echo $containerType; ?>"><?php echo $device['shared']['name']; ?></div>
								<div class="deviceQuickStats">
									<div class="quickStatsLeft">
										<div style="margin-top: 4px;"><div style="width:100px; float:left;">Last connect:</div> <span class="last_connection"><?php echo $device['track']['last_connection']; ?></span></div>
										<div style="display:none;"><div style="width:80px; float:left;">Last change:</div> <span class="last_change"><?php echo $device['device']['$timestamp']; ?></span></div>
									</div>
									<div class="quickStatsTemp">
										<!--<img src="<?php echo base_url() . "images/fan.png"; ?>" /><span class="current_fan"><?php echo $device['device']['fan_mode']; ?></span>--><img src="<?php echo base_url() . "images/humidity.png"; ?>" /><span class="current_humidity"><?php echo $device['device']['current_humidity']; ?>%</span><img src="<?php echo base_url() . "images/thermometer.png"; ?>" /><span class="current_temp"><?php echo $device['shared']['current_temperature']; ?>&deg;</span>
									</div>
								</div>
							</div>			
							
							<div class="bottomContainer">

								<!--
								<div class="statGroup">
									<div class="statGroupTitle">Away Settings</div>
									<div class="statContainer">
										<div class="statName">Auto-Away</div>
										<div class="statValue">
											<?php
											$enabledVal = 'Disabled';
											if($device['device']['auto_away_enable'])  $enabledVal = 'Enabled';
											echo $enabledVal;
											?>
										</div>
										<div class="statName">Temperature</div>
										<div class="statValue">
											<?php
											$enabledVal = 'Disabled';
											if($device['device']['away_temperature_high_enabled'])  $enabledVal = 'Enabled';
											?>
											High: <?php echo $device['device']['away_temperature_high'] . ' (' . $enabledVal . ')'; ?><br />

											<?php
											$enabledVal = 'Disabled';
											if($device['device']['away_temperature_low_enabled'])  $enabledVal = 'Enabled';
											?>
											Low: <?php echo $device['device']['away_temperature_low'] . ' (' . $enabledVal . ')'; ?>
										</div>
									</div>
								</div>
								-->
								<div class="latestEnergyContainer">
									<div class="usageImg">
										<div class="usageImgTitle">Energy Usage (hours)</div>
										<img class="usageChart" src="//chart.googleapis.com/chart?chf=bg,s,FFFFFF&chxl=1:|<?php echo $device['latestEnergy']['labels']; ?>&chxr=0,0,<?php echo $device['latestEnergy']['maxHrs']; ?>&chxt=y,x&chbh=33,5&chs=410x70&cht=bvs&chco=ff5200,3D79FF&chds=0,<?php echo $device['latestEnergy']['maxHrs']; ?>,0,95&chd=t:<?php echo $device['latestEnergy']['dataHeat']; ?>|<?php echo $device['latestEnergy']['dataCool']; ?>" width="410" height="70" alt="" />
									</div>
								</div>
								<div class="targetTempContainer">
									<div class="target_temp targetTemp<?php echo $containerType; ?>"><?php echo $device['shared']['target_temperature']; ?>&deg;</div>
									<div class="target_eta">
										<?php 
										$eta = $device['device']['time_to_target'];
										$diff = number_format(($eta - time())/60, 0);

										if($eta > 0)
										{
											echo 'in about ' . $diff . ' minutes'; 
										}
										else
										{
											echo 'TARGET';
										}
										?>
									</div>
								</div>
							</div>
						</div>
					</div>
					<?php
				}
				?>
			</div>
		</div>
		<div class="weatherContainer" id="weather_<?php echo $struct_id; ?>">
			<div class="nowContainer">
				<div class="nowConditionContainer">
					<div class="nowConditionIcon"><img style="" src="<?php echo base_url() . "images/weather/big/" . $struct['weather']['now']['icon'] . ".png"; ?>" /></div>
					<div class="nowConditionTitle"><?php echo $struct['weather']['now']['conditions']; ?></div>
					<div class="nowTempHumid">
						<img src="<?php echo base_url() . "images/humidity.png"; ?>" height="12" width="7" style="vertical-align:middle;" /> <span class="nowHumid"><?php echo $struct['weather']['now']['current_humidity'] . '%'; ?></span>&nbsp;&nbsp;&nbsp;&nbsp;<img src="<?php echo base_url() . "images/thermometer.png"; ?>" height="12" width="5" style="vertical-align:middle;" /> <span class="nowTemp"><?php echo  $struct['weather']['now']['current_temperature'] . '&deg'; ?></span>
					</div>
				</div>
				<div class="nowName">Now</div>
			</div>
			<div class="forecastContainer">
				<?php 
				foreach($struct['weather']['forecast']['daily'] as $i => $daily)
				{				
					?>
					<div class="dayContainer day_<?php echo $i; ?>">
						<div class="conditionContainer">
							<div class="conditionIcon"><img src="<?php echo base_url() . "images/weather/" . $daily['icon'] . ".png"; ?>" /></div>
							<div class="conditionTitle"><?php echo $daily['conditions']; ?></div>
							<div class="hilo"><?php echo $daily['high_temperature'] . '&deg | ' . $daily['low_temperature'] . '&deg'; ?></div>
						</div>
						<div class="dayName"><?php echo $daily['date']; ?></div>
					</div>
					<?php
				}
				?>
			</div>
		</div>
		<?php
	}
	?>
	<div id="body">
		<?php
			//var_dump($devices);
			//var_dump($structs);
		?>
	</div>

	<!--<p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>-->
</div>

</body>
</html>