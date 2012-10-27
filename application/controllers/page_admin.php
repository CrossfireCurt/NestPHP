<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Page_admin extends CI_Controller {

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

    public function index($site_id = null){
        if (!$site_id) redirect(base_url() . 'index.php/site_admin');
        //todo: what should happen if a user comes to this page with no params?
        $this->load->model('Page_model', 'page');
        $this->load->model('Site_model', 'site');

        $viewData = array(); 
        $viewData['existingPages'] = "";
        $viewData['formController'] = "page_admin";

        $user_id = $this->session->userdata('user_id');
        $pages = $this->page->getSitePages($user_id, $site_id);

        $viewData['site_info'] = $this->site->getUserSites($user_id);

        if (!$viewData['site_info']){
            $siteUrl = base_url() . 'index.php/site_admin/';
            $viewData['sites'] = 'You have no sites! <a href="' . $siteUrl . '">Set one up NOW >:-0</a>';
        }


        //existing pages
        foreach ($pages as $page)
        {
            $lastGoogleCrawl = $this->page->getLastCrawl($page['id'], 'google');
            $lastGoogleCrawlDate = 'unknown';
            $lastBingCrawl = $this->page->getLastCrawl($page['id'], 'bing');
            $lastBingCrawlDate = 'unknown';

            if(count($lastGoogleCrawl) > 0)
                $lastGoogleCrawlDate = $lastGoogleCrawl['date_crawl'];

            if(count($lastBingCrawl) > 0)
                $lastBingCrawlDate = $lastBingCrawl['date_crawl'];

            //makes the HTML links for 'existing pages' section
            $crawlActions = ' <a href="'. base_url() .'index.php/page_admin/scrape/' . $page['id'] . '">refresh</a> | <a href="'. base_url() .'index.php/page_admin/crawl_history/' . $page['id'] . '">history</a>';

            $viewData['existingPages'] .= $page['id'] . " - url: " . $page['url'] . " - <a href=\"" . base_url() . "index.php/page_admin/edit/" . $page['id'] . "\">edit</a> | <a href=\"" . base_url() . "index.php/page_admin/delete/" . $page['id'] . "\">delete</a>, Last Google crawl: <b>" . $lastGoogleCrawlDate . "</b> | Last Bing crawl: <b>" . $lastBingCrawlDate . "</b> - " . $crawlActions . "<br />";
        }


        //print_r($viewData);
        $this->load->view('page_create', $viewData);
    }

    public function scrape($id)
    {
        if(!isset($id))
            redirect(base_url() . 'index.php/page_admin');
        else
            $this->updateCrawlDates($id);
    }

    public function crawl_history($id)
    {
        if (!isset($id)){
            $flash = array(
            'status'   => 'error',
            'message'   => 'Invalid arguments.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/page_admin');
        } else {
            $view_data = array();
            $this->load->model('Page_model', 'page');
            $history = $this->page->getCrawlHistory($id);

            $view_data['history_dump'] = $history;

            $this->load->view('page_history', $view_data);
        }
    }

    public function create(){
        if (!$_POST) die ("page must be accessed through post");

        $this->load->model('site_model', 'site');
        
        $pageData = array();
        $pageData['url'] = $this->input->post('createPage_url');
        $pageData['title'] = $this->input->post('createPage_title');
        $pageData['keywords'] = $this->input->post('createPage_keywords');
        $pageData['description'] = $this->input->post('createPage_description');
        
        //TODO: this lets you choose which site to add the page to. finish this
        $pageData['site_id'] = $this->input->post('createPage_site'); //returns site id
        
        //die(var_dump($pageData));
        if (!$this->site->userOwnsSite($pageData['site_id']))
            return false;
        
        //i made the regex aaaall by myself! :-)
        if (!preg_match('([a-zA-z0-9/\.\?=]+?\.[a-z]{2,4})', $pageData['url'])){
            $flash = array(
                'status'    => 'error',
                'message'   => 'Invalid page.'
            );
            $this->session->set_flashdata($flash);
            //temp redir
            redirect(base_url() . "index.php/page_admin/index/" . $pageData['site_id']);
        }
        
        //check fields
		$error = false;
        foreach ($pageData as $key => $check){
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
            redirect(base_url() . "index.php/page_admin/index/" . $pageData['site_id']);
        }

        $this->load->model('page_model', 'pagedb');
        $user_id = $this->session->userdata('user_id');
        $id = $this->pagedb->createPage($pageData);

        $flash = array(
        'status'   => 'success',
        'message'   => 'Successfully created page. ID: ' . $id
        );
        $this->session->set_flashdata($flash);
        //todo: redir to their page list for the site
        redirect(base_url() . "index.php/page_admin/index/" . $pageData['site_id']);
    }

    private function userOwnsPage($id = null)
    {
        if (is_null($id)) exit;
        $user_id = $this->session->userdata('user_id');
        $this->load->model('page_model', 'pagedb');
		$this->load->model('site_model', 'site');
		
		$page = $this->pagedb->getPage($id);
		if(is_null($page)) exit;
		
		if($this->site->userOwnsSite($page['site_id']))
			return true;

        return false;
    }

	public function updateAllCrawlDates($site_id)
	{
		if($this->session->userdata('is_admin') != 1) exit;
		if (!$site_id) redirect(base_url() . 'index.php/site_admin');
        //todo: what should happen if a user comes to this page with no params?
        $this->load->model('Page_model', 'page');
        $this->load->model('Site_model', 'site');

        $viewData = array(); 

        $user_id = $this->session->userdata('user_id');
        $pages = $this->page->getSitePages($user_id, $site_id);
		ob_implicit_flush(true);
		ob_end_flush();
		set_time_limit(30000);
		foreach($pages as $page)
		{
			try{
				$this->updateCrawlDates($page['id'], false);
				echo $page['id'] . ' success!<br/>';
			}catch(Exception $e){
				echo $page['id'] . ' fail ' . $e->getMessage() . $page['url'] . '<br />';
				$this->page->deletePage($page['id']);
			}
			sleep(10);
		}
	}

    private function updateCrawlDates($id, $redirect = true)
    {
        //TODO: You need make an isAdmin flag or function and put it in a helper.
        //if($this->session->userdata('is_admin') != 1) exit;

        $this->load->model('page_model', 'pagedb');
        $this->load->model('stats_model', 'stats');
		$this->load->model('site_model', 'site');

        $user_id = $this->session->userdata('user_id');
        $page = $this->pagedb->getPage($id);
        $site = $this->site->getUserSite($user_id, $page['site_id']);

		if(!$this->site->userOwnsSite($page['site_id'])) exit;
        $errorMsg = null;
        
        $full_site = $site['base_url'] . '/' . $page['url'];
        
        try{
            $googleLastCrawlDate = $this->stats->getLastAccessTime($full_site, 'c', 'google');
            $this->pagedb->recordCrawlDate($id, $googleLastCrawlDate, 'google');
        }catch(Exception $e){
            $errorMsg = 'Unable to update Google\'s last crawl date.';
        }

        /*try{
            $bingLastCrawlDate = $this->stats->getLastAccessTime($full_site, 'c', 'bing');
            $this->pagedb->recordCrawlDate($id, $bingLastCrawlDate, 'bing');
        }catch(Exception $e){
            $errorMsg .= '<br/>Unable to update Bing\'s last crawl date.';
        }*/

		if(!$redirect)
		{
			if(strlen($errorMsg) > 0)
				throw new Exception($errorMsg);
			
			return;
		}

        if(!is_null($errorMsg))
        {
            $flash = array(
				'status'   => 'error',
				'message'   => $errorMsg
            );
        }
        else
        {
            $flash = array(
            'status'   => 'success',
            'message'   => 'Updated both last crawl dates.'
            );
        }

        $this->session->set_flashdata($flash);
        redirect(base_url() . "index.php/page_admin/index/" . $page['site_id']);
    }

    public function edit($id = null){
        if(is_null($id)) redirect(base_url() . "index.php/page_admin");
        if(!$this->userOwnsPage($id)) redirect(base_url() . "index.php/page_admin");

        $this->load->model('page_model', 'pagedb');
        $user_id = $this->session->userdata('user_id');
        $info = $this->pagedb->getPage($id);

        if(!$info) exit;

        if($_POST)
        {
            $pageData					= array();
            $pageData['url']			= $this->input->post('editPage_url');
            $pageData['title']			= $this->input->post('editPage_title');
            $pageData['keywords']		= $this->input->post('editPage_keywords');
            $pageData['description']	= $this->input->post('editPage_description');

            $this->pagedb->updatePage($id, $pageData);

            $flash = array(
				'status'   => 'success',
				'message'   => 'Successfully edited page. ID: ' . $id
            );

            $this->session->set_flashdata($flash);
            //todo: redir to page_admin/index/siteid
            redirect(base_url() . "index.php/page_admin/index/1");
        }

        $this->load->model('User_model', 'user');

        $userData = $this->user->getUser($user_id);
        $viewData = $info;
        
        
        if($userData['ga_token_status'] > 0)
        {
            $this->load->model('Google_model', 'google');
            $this->google->setToken($userData['ga_token']);
            $profiles = $this->google->getProfileList();
            $viewData['ga_profiles'] = $profiles;
            $this->google->setProfileById($profiles[0]['tableId']);
            var_dump($this->google->getPageViewsByPagePath());
        }
        

        $viewData['formController'] = "page_admin";
        $this->load->view('page_edit', $viewData);

    }


    public function delete($id){ //load page delete view
        if (!isset($id)) die (":getout:");
        if(!$this->userOwnsPage($id)) die("unauthorized");
        if ($_POST){
            $this->load->model('page_model', 'pagedb');

            $user_id = $this->session->userdata('user_id');
            $query = $this->pagedb->deletePage($id);

            if ($query){
                $flash = array(
                'status'   => 'success',
                'message'   => 'Successfully deleted page. ID: ' . $id
                );
                $this->session->set_flashdata($flash);
                //todo: redir to page_admin/index/siteid to list pages in the site
                redirect(base_url() . "index.php/page_admin/index/1"); //successful query
            }
        } else {
            //load confirmation screen
            $info['id'] = $id;
            $this->load->view('page_delete', $info);
        }
    }

}

/* end of page_admin controller */
