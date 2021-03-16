<?php


use App\Models\Term;
use App\Models\Career;
use BabDev\Breadcrumbs\Contracts\BreadcrumbsGenerator;
use BabDev\Breadcrumbs\Contracts\BreadcrumbsManager;
    
    Route::get('/dashboard', function() {
        return view('dashboard');
    });

    Route::get('/dashboard/terms', function() {
        return view('terms');
    });

    Route::get('/dashboard/careers', function() {
        return view('careers');
    });

    Route::get('/dashboard/careers/import', function() {
        return view('pages.careers.import');
    });  

    Route::get('/dashboard/logs', function() {
        return view('logs');
    });   
    
    Route::get('/dashboard/terms/delete/{term_id}', function ($term_id) {
        $term = Term::select("*")->where('id', $term_id)->get()[0];
        return view('deleteTerm', ["term" => $term]);
    }); 

    Route::get('/dashboard/students', function() {
        return view('students.index');
    });  


    /*
    * You may use either the Breadcrumbs facade or the $breadcrumbs variable in this file,
    * both of which reference the `BreadcrumbsManager` service
    */

    /** @var $breadcrumbs BreadcrumbsManager */

    // Dashboard
    Breadcrumbs::for('dashboard', static function ($trail) {
        $trail->push('Panell de control', route('dashboard'));
    });

    // Dashboard > Students
    Breadcrumbs::for('students', static function ($trail) {
        $trail->parent('dashboard');
        $trail->push('Alumnes', '/admin/dashboard/students');
    });

    // Dashboard > Terms
    Breadcrumbs::for('terms', static function ($trail) {
        $trail->parent('dashboard');
        $trail->push('Cursos', '/admin/dashboard/terms');
    });

    // Dashboard > Terms > Delete[Term]
    Breadcrumbs::for('term', function ($trail, $term) {
        $trail->parent('terms');
        $trail->push($term->name, '/dashboard/terms/delete/{term_id}');
    });

    // Dashboard > Terms > [Term]
    Breadcrumbs::for('term_career', function ($trail, $term) {
        $trail->parent('terms');
        $trail->push($term->name, '/dashboard/terms/{term_id}');
    });

    // Dashboard > Careers
    Breadcrumbs::for('careers', function ($trail) {
        //$trail->parent('term_career');
        $trail->parent('dashboard');
        $trail->push("Cicles", '/dashboard/careers');
    });

    // Dashboard > Careers > Import careers
    Breadcrumbs::for('career', function ($trail) {
        $trail->parent('careers');
        $trail->push("Importar cicles", '/dashboard/careers/import');
    });
