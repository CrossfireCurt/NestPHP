<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Api extends CI_Controller {

	private $auth_realm = "titan";
	private $api_user = null;

	function __construct(){
        parent::__construct();
    }

	public function getPage($id = null)
	{
		$this->processRequest('get');

		$this->load->model('Page_model', 'page');

		if(!is_null($id))
		{
			$data = $this->page->getUserPage($this->api_user['id'], $id);

			if(is_null($data) || count($data) == 0)
				die($this->sendResponse(204));

			unset($data['user_id']);
			unset($data['is_deleted']);
		}
		else
		{
			$data = $this->page->getUserPages($this->api_user['id']);

			if(is_null($data) || count($data) == 0)
				die($this->sendResponse(204));

			foreach($data as $key => $datum)
			{
				unset($data[$key]['user_id']);
				unset($data['is_deleted']);
			}
		}

		$this->sendResponse(200, json_encode($data));
	}

	public function getPages()
	{
		$this->getPage();
	}

	public function getPageByUrl($pageUrl = null)
	{
		$pageUrl = rawurldecode(urldecode($pageUrl));

		$this->processRequest('get');

		if(!is_null($pageUrl))
		{
			$this->load->model('Page_model', 'pagedb');
			$this->load->model('Site_model', 'site');

			$data = $this->pagedb->getPageByUrl($pageUrl);
			if(!$this->site->userOwnsSite($page['site_id'], $this->api_user['id'])) 
				die($this->sendResponse(403));

			if(is_null($data) || count($data) == 0)
				die($this->sendResponse(204));

			unset($data['user_id']);
			unset($data['is_deleted']);
		}
		else
			die($this->sendResponse(204));

		$this->sendResponse(200, json_encode($data));

	}

/*================= End user callable functions =================*/

	private function authenticate()
	{
		$this->auth_realm = $this->settings->getVal('app_name');
		
		if(empty($_SERVER['PHP_AUTH_DIGEST']))
		{
			header('HTTP/1.1 401 Unauthorized');
			header('WWW-Authenticate: Digest realm="' . $this->auth_realm . '",qop="auth",nonce="' . uniqid() . '",opaque="' . md5($this->auth_realm) . '"');
			die($this->sendResponse(401));
		}

		$data = $this->http_digest_parse($_SERVER['PHP_AUTH_DIGEST']);

		if(!$data) die($this->sendResponse(401));

		$this->load->model('User_model', 'user');
		$user = $this->user->getUserByUsername($data['username']);

		if(is_null($user) || count($user) == 0)
			die($this->sendResponse(401));

		$this->api_user = $user;
		
		// generate the valid response
		$A1 = md5($data['username'] . ':' . $this->auth_realm . ':' . $user['api_key']);
		$A2 = md5($_SERVER['REQUEST_METHOD'] . ':' . $data['uri']);
		$valid_response = md5($A1 . ':' . $data['nonce'] . ':' . $data['nc'] . ':' . $data['cnonce'] . ':' . $data['qop'] . ':' . $A2);
        
		if ($data['response'] != $valid_response)
			die($this->sendResponse(401));

		return true;
	}

	private function http_digest_parse($txt)
	{
	   $needed_parts = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
	   $data = array();

	   preg_match_all('@(\w+)=(?:(?:\'([^\']+)\'|"([^"]+)")|([^\s,]+))@', $txt, $matches, PREG_SET_ORDER);

	   foreach ($matches as $m) {
		   $data[$m[1]] = $m[2] ? $m[2] : ($m[3] ? $m[3] : $m[4]);
		   unset($needed_parts[$m[1]]);
	   }

	   return $needed_parts ? false : $data;
	}

	private function processRequest($requiredMethod = 'get')
	{
		$this->authenticate();
		$request_method = strtolower($_SERVER['REQUEST_METHOD']);

		switch ($request_method)
		{
			case 'get':
				$data = $_GET;
				break;	

			//other methods go here
		}

		if($requiredMethod != $request_method)
			die($this->sendResponse(405));

		return true;
	}

	private function sendResponse($status = 200, $body = null, $content_type = 'text/html')
	{
		$status_header = 'HTTP/1.1 ' . $status . ' ' . $this->getStatusCodeMessage($status);

		header($status_header);
		header('Content-type: ' . $content_type);

		if(!is_null($body))
		{
			echo $body;
			exit;
		}

		$message = '';

		switch($status)
		{
			case 401:
				$message = 'You must be authorized to view this page.';
				break;
			case 404:
				$message = 'The requested URL ' . $_SERVER['REQUEST_URI'] . ' was not found.';
				break;
			case 500:
				$message = 'The server encountered an error processing your request.';
				break;
			case 501:
				$message = 'The requested method is not implemented.';
				break;
		}

		$signature = ($_SERVER['SERVER_SIGNATURE'] == '') ? $_SERVER['SERVER_SOFTWARE'] . ' Server at ' . $_SERVER['SERVER_NAME'] . ' Port ' . $_SERVER['SERVER_PORT'] : $_SERVER['SERVER_SIGNATURE'];

		$viewData = array(
			'signature'			=> $signature,
			'message'			=> $message,
			'status'			=> $status,
			'statusCodeMessage' => $this->getStatusCodeMessage($status)
		);

		echo $this->load->view('api_error', $viewData, true);
		exit;
	}

	private function getStatusCodeMessage($status)
	{
		$codes = Array(
		    100 => 'Continue',
		    101 => 'Switching Protocols',
		    200 => 'OK',
		    201 => 'Created',
		    202 => 'Accepted',
		    203 => 'Non-Authoritative Information',
		    204 => 'No Content',
		    205 => 'Reset Content',
		    206 => 'Partial Content',
		    300 => 'Multiple Choices',
		    301 => 'Moved Permanently',
		    302 => 'Found',
		    303 => 'See Other',
		    304 => 'Not Modified',
		    305 => 'Use Proxy',
		    306 => '(Unused)',
		    307 => 'Temporary Redirect',
		    400 => 'Bad Request',
		    401 => 'Unauthorized',
		    402 => 'Payment Required',
		    403 => 'Forbidden',
		    404 => 'Not Found',
		    405 => 'Method Not Allowed',
		    406 => 'Not Acceptable',
		    407 => 'Proxy Authentication Required',
		    408 => 'Request Timeout',
		    409 => 'Conflict',
		    410 => 'Gone',
		    411 => 'Length Required',
		    412 => 'Precondition Failed',
		    413 => 'Request Entity Too Large',
		    414 => 'Request-URI Too Long',
		    415 => 'Unsupported Media Type',
		    416 => 'Requested Range Not Satisfiable',
		    417 => 'Expectation Failed',
		    500 => 'Internal Server Error',
		    501 => 'Not Implemented',
		    502 => 'Bad Gateway',
		    503 => 'Service Unavailable',
		    504 => 'Gateway Timeout',
		    505 => 'HTTP Version Not Supported'
		);

		return (isset($codes[$status])) ? $codes[$status] : '';
	}
}
