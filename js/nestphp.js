var currentContainerType = null;
var activeElems = new Array('topContainer',	'deviceName', 'targetTemp', 'container');

var loadStats = function(){
	$.get(base_url + "index.php/nest_admin/echoData", function(data){
		data = $.parseJSON(data);
		parseThermoData(data);
		console.log('parsed');
	});
};

var parseThermoData = function(data){
	$.each(data['structs'], function(struct_id, struct){

		var weatherNowElem = $('#weather_' + struct_id + ' .forecastContainer');
		var nowData = struct['weather']['now'];
		$.each(struct['weather']['forecast']['daily'], function(dayNum, daily){
			var dayElem = weatherNowElem.find('.day_' + dayNum);
			dayElem.find('.conditionIcon').html('<img src="' + base_url + "images/weather/" + daily['icon'] + '.png" />');
			dayElem.find('.conditionTitle').html(daily['conditions']);
			dayElem.find('.hilo').html(daily['high_temperature'] + '&deg | ' + daily['low_temperature'] + '&deg');
			dayElem.find('.dayName').html(daily['date']);
		});

		weatherNowElem.find('.nowConditionIcon').html('<img src="' + base_url + "images/weather/big/" + nowData['icon'] + '.png" />');
		weatherNowElem.find('.nowConditionTitle').html(nowData['conditions']);
		weatherNowElem.find('.nowTemp').html(nowData['current_temperature'] + '&deg');
		weatherNowElem.find('.nowHumid').html(nowData['current_humidity'] + '%');
		weatherNowElem.find('.nowName').html(nowData['date']);
	});

	$.each(data['devices'], function(device_id, device){

		var parent = $('#device_' + device_id);
		parent.find('.last_connection').html(device['track']['last_connection']);
		parent.find('.last_change').html(device['device']['$timestamp']);
		parent.find('.current_humidity').html(device['device']['current_humidity'] + '%');
		parent.find('.current_temp').html(device['shared']['current_temperature'] + '&deg;');

		parent.find('.target_temp').html(device['shared']['target_temperature'] + '&deg;');
	
		var eta = device['device']['time_to_target']*1000;
		var diff = ((eta - (new Date()).getTime())/60/1000).toFixed(0);

		var etaText = 'TARGET';
		if(eta > 0)
		{
			etaText = 'in about ' + diff + ' minutes'; 
		}
		
		parent.find('.target_eta').html(etaText);

		parent.find('.usageChart').attr('src', '//chart.googleapis.com/chart?chf=bg,s,FFFFFF&chxl=1:|' + device['latestEnergy']['labels'] + '&chxr=0,0,' + device['latestEnergy']['maxHrs'] + '&chxt=y,x&chbh=33,5&chs=410x70&cht=bvs&chco=ff5200,3D79FF&chds=0,' + device['latestEnergy']['maxHrs'] + ',0,95&chd=t:' + device['latestEnergy']['dataHeat'] + '|' + device['latestEnergy']['dataCool']);

		var containerType = 'Plain';
		if(device['shared']['hvac_heater_state'])
		{
			containerType = 'Warming';

		}
		else if(device['shared']['hvac_ac_state'])
		{
			containerType = 'Cooling';
		}

		
		if(containerType != currentContainerType)
		{	var parentParent = parent.parent();
			if(currentContainerType != null)
			{
				$.each(activeElems, function(i, elem){
					parentParent.find('.' + elem + currentContainerType).removeClass(elem + currentContainerType).addClass(elem + containerType);
				});			
			}
			else
			{
				$.each(activeElems, function(i, elem){
					parentParent.find('.' + elem + 'Warming').removeClass(elem + 'Warming').addClass(elem + containerType);
					parentParent.find('.' + elem + 'Cooling').removeClass(elem + 'Cooling').addClass(elem + containerType);
					parentParent.find('.' + elem + 'Plain').removeClass(elem + 'Plain').addClass(elem + containerType);
				});
			}

			currentContainerType = containerType;
		}
		
	});
};

var onLoad = function(){
	
	var dataInterval = setInterval(loadStats, 10000);
};