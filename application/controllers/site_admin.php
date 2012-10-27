<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Site_admin extends CI_Controller {

    private $is_admin = null;

    function __construct(){
        parent::__construct();

        $this->load->model('User_model', 'user');

        if(!$this->user->isLoggedIn()) exit;

        $this->load->helper('url');
        $this->load->library('session');
        $username = $this->session->userdata('username');
        $this->is_admin = $this->session->userdata('is_admin');
        $loggedIn = ($this->session->userdata('logged_in') === true);

        $viewData = array(
			'username' => $username,
			'loggedIn' => $loggedIn,
			'isAdmin'  => $this->is_admin
        );

        $this->load->view('includes/header', $viewData);
    }

    public function index(){ //main page
        $this->load->model('Site_model', 'site');
        $user_id = $this->session->userdata('user_id');
        $viewData = array();
		$viewData['existingSites'] = $this->site->getUserSites($user_id);
		
        $this->load->view('site_create', $viewData);
    }

	public function import()
	{
        $this->load->model('page_model', 'pagedb');
		$this->load->model('site_model', 'site');
        $user_id = $this->session->userdata('user_id');

        $this->load->model('User_model', 'user');

        $userData = $this->user->getUser($user_id);
        $viewData = array();

		if(!$_POST)
		{
			if($userData['ga_token_status'] > 0)
			{
				$this->load->model('Google_model', 'google');
				$this->google->setToken($userData['ga_token']);
				$profiles = $this->google->getProfileList();
				$viewData['ga_profiles'] = $profiles;
			}

			$this->load->view('site_import', $viewData);			
			return;
		}
        
        $tableId = $this->input->post('gaTableId');

        if($userData['ga_token_status'] > 0)
        {
            $this->load->model('Google_model', 'google');
            $this->google->setToken($userData['ga_token']);
            //$profiles = $this->google->getProfileList();
            //$viewData['ga_profiles'] = $profiles;
            $this->google->setProfileById($tableId);
			
			$endDate = date('Y-m-d', time());
			$startDate = date('Y-m-d', strtotime($endDate . ' -3 weeks'));
			$this->google->setDateRange($startDate, $endDate);
            $results = $this->google->getPageViewsByPagePath();

			$hostnames = array();
			$urls = array();

			if(count($results) > 0)
			{
				//var_dump($results);
				//exit;
				foreach($results as $pageToImport)
				{
					
					if($pageToImport['value'] < 5) continue;

					$siteIndex = array_search($pageToImport['metrics']['hostname'], $hostnames);
					if($siteIndex === false)
					{
						$siteData = array();
						$siteData['base_url'] = 'http://' . $pageToImport['metrics']['hostname'];
						$siteData['name'] = $pageToImport['metrics']['hostname'];
						$siteData['desc'] = '';

						$siteIndex = $this->site->addNewSiteToUser($user_id, $siteData);

						$hostnames[$siteIndex] = $pageToImport['metrics']['hostname'];
					}

					if(!isset($urls[$siteIndex])) 
						$urls[$siteIndex] = array();

					$urlIndex = array_search($pageToImport['metrics']['pagePath'], $urls[$siteIndex]);

					if($urlIndex !== false)
						continue;

					$pageData = array();
					$pageData['url'] = $pageToImport['metrics']['pagePath'];
					$pageData['title'] = $pageToImport['metrics']['pageTitle'];
					$pageData['keywords'] = '';
					$pageData['description'] = '';
					$pageData['site_id'] = $siteIndex;
					$this->pagedb->createPage($pageData);
					$urls[$siteIndex][] = $pageToImport['metrics']['pagePath'];
				}
			}
            
            $flash = array(
                'status'    => 'success',
                'message'   => 'Successfully imported site.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/site_admin');
        }
	}

   
    public function create(){
        if (!$_POST) exit;

        $siteData = array();
        $siteData['base_url'] = $this->input->post('createSite_baseUrl');
        $siteData['name'] = $this->input->post('createSite_name');
        $siteData['desc'] = $this->input->post('createSite_desc');

        //check fields
        foreach ($siteData as $key => $check){
            if ($check == null){
                $error_msg = $key . " cannot be blank.";
                $error = true;
            }
            if ($error) break;
        }

        if ($error){
            $flash = array(
				'status'    => 'error',
				'message'   => $error_msg
            );

            $this->session->set_flashdata($flash);
            redirect(base_url() . "index.php/site_admin");
        }

        $this->load->model('site_model', 'site');
        $user_id = $this->session->userdata('user_id');
        $id = $this->site->addNewSiteToUser($user_id, $siteData);

        $flash = array(
			'status'   => 'success',
			'message'   => 'Successfully created site. ID: ' . $id
        );
        $this->session->set_flashdata($flash);
        redirect(base_url() . "index.php/site_admin");
    }

    public function edit($id = null){
        if(is_null($id)) redirect(base_url() . "index.php/site_admin");
        
		$this->load->model('site_model', 'site');
        if(!$this->site->userOwnsSite($id)) redirect(base_url() . "index.php/site_admin");
		
		$user_id = $this->session->userdata('user_id');
		$info = $this->site->getUserSite($user_id, $id);

		if(!$info) 
			exit; 

        if($_POST)
		{
            $siteData				= array();
            $siteData['base_url']	= $this->input->post('editSite_baseUrl');
            $siteData['name']		= $this->input->post('editSite_name');
            $siteData['desc']		= $this->input->post('editSite_desc');

            $this->site->updateSite($id, $siteData);

            $flash = array(
				'status'   => 'success',
				'message'   => 'Successfully edited site. ID: ' . $id
            );

            $this->session->set_flashdata($flash);
            redirect(base_url() . "index.php/site_admin");
        }
		
		$this->load->model('User_model', 'user');

		$userData = $this->user->getUser($user_id);

		$viewData = $info;
        $viewData['id'] = $id;

		$this->load->view('site_edit', $viewData);
        
    }


    public function delete($id){ //load page delete view
        if (!isset($id)) exit;
		$this->load->model('site_model', 'site');
        if(!$this->site->userOwnsSite($id)) exit;
        if ($_POST){
            $user_id = $this->session->userdata('user_id');
            $query = $this->site->removeSiteFromUser($user_id, $id);

            if ($query){
                $flash = array(
                'status'   => 'success',
                'message'   => 'Successfully deleted site. ID: ' . $id
                );
                $this->session->set_flashdata($flash);

                redirect(base_url() . "index.php/site_admin"); //successful query
            }
        } else {
            //load confirmation screen
            $info['id'] = $id;
            $this->load->view('site_delete', $info);
        }
    }
}

/* end of page_admin controller */
