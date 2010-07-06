<?php
/**
 * Batcher
 *
 * Copyright 2010 by Shaun McCormick <shaun@modxcms.com>
 *
 * This file is part of Batcher, a batch resource editing Extra.
 *
 * Batcher is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * Batcher is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Batcher; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * @package batcher
 */
/**
 * Change template for multiple resources
 *
 * @package batcher
 * @subpackage processors
 */
if (!$modx->hasPermission('save_template')) return $modx->error->failure($modx->lexicon('access_denied'));


if (empty($scriptProperties['template'])) return $modx->error->failure($modx->lexicon('batcher.template_err_ns'));
$template = $modx->getObject('modTemplate',$scriptProperties['template']);
if (empty($template)) return $modx->error->failure($modx->lexicon('batcher.template_err_nf'));

$resources = $template->getMany('Resources');

if (empty($scriptProperties['tvs'])) return $modx->error->failure($modx->lexicon('batcher.tvs_err_ns'));

$tvs = array();
foreach ($scriptProperties as $key => $value) {
    if (substr($key,0,2) != 'tv' || $key == 'tvs') continue;
    $id = (int)substr($key,2);
    if (empty($scriptProperties['tv'.$id.'-checkbox'])) continue;
    $tv = $modx->getObject('modTemplateVar',$id);
    if (!$tv) continue;

    switch ($tv->get('type')) {
        case 'url':
            if ($scriptProperties['tv'.$tv->get('id').'_prefix'] != '--') {
                $value = str_replace(array('ftp://','http://'),'', $value);
                $value = $scriptProperties['tv'.$tv->get('id').'_prefix'].$value;
            }
            break;
        case 'date':
            $value = empty($value) ? '' : strftime('%Y-%m-%d %H:%M:%S',strtotime($value));
            break;
        default:
            /* handles checkboxes & multiple selects elements */
            if (is_array($value)) {
                $featureInsert = array();
                while (list($featureValue, $featureItem) = each($value)) {
                    $featureInsert[count($featureInsert)] = $featureItem;
                }
                $value = implode('||',$featureInsert);
            }
            break;
    }


    /* change resource values */
    foreach ($resources as $resource) {
        /* if different than default and set, set TVR record */
        if ($value != $tv->get('default_text')) {

            /* update the existing record */
            $tvc = $modx->getObject('modTemplateVarResource',array(
                'tmplvarid' => $tv->get('id'),
                'contentid' => $resource->get('id'),
            ));
            if ($tvc == null) {
                /* add a new record */
                $tvc = $modx->newObject('modTemplateVarResource');
                $tvc->set('tmplvarid',$tv->get('id'));
                $tvc->set('contentid',$resource->get('id'));
            }
            $tvc->set('value',$value);
            $tvc->save();

        /* if equal to default value, erase TVR record */
        } else {
            $tvc = $modx->getObject('modTemplateVarResource',array(
                'tmplvarid' => $tv->get('id'),
                'contentid' => $resource->get('id'),
            ));
            if ($tvc != null) $tvc->remove();
        }
    }
    reset($resources);
}
return $modx->error->success();