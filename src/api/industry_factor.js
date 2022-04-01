import request from '../utils/request';
import {setConf} from '../api/adsconf'
import { ElMessage } from "element-plus";

function confDeleteEntity(conf, entity) {
  for (let k = 0; k < conf.industry_factors.length; k++) {
    let item = conf.industry_factors[k];

    for (let i = 0; i < item.entity_codes.length; i++) {
      if (item.entity_codes[i] === entity) {
        item.entity_codes.splice(i, 1);
        if (item.entity_codes.length === 0) {
          conf.industry_factors.splice(k, 1);
        }
        return;
      }
    }
  }
}

function updateConf(conf, msg) {
  setConf(conf).then(res => {
    ElMessage.success(msg);
  });
}

function checkFactor(factor) {
  return true;
}

function confAddEntity(conf, in_entity, in_factor) {
  let factor = parseFloat(in_factor);
  if (isNaN(factor) || factor < 0) {
    return false;
  }

  let entity_list = in_entity.split(/\s+/);
  if (entity_list.length === 0) {
    return false;
  }

  for (const entity of entity_list) {
    confDeleteEntity(conf, entity);
  }

  let item = {
    'entity_codes': entity_list,
    'factor': factor
  };

  conf.industry_factors.push(item);

  return true;
}

function ErrorMsg(msg) {
  ElMessage({
    type: 'error',
    showClose: true,
    duration: 0,
    message: msg
  })
}

export function addEntity(conf, entity, factor) {
  if (!confAddEntity(conf, entity, factor)) {
    ErrorMsg("Invalid input! Fail to add entity: " + entity);
    return false;
  }

  updateConf(conf, "Succefully add entity: " + entity);

  return true;
}

export function deleteEntity(conf, entity) {
  confDeleteEntity(conf, entity);
  setConf(conf).then(res => {
    ElMessage.success("Succefully delete the entity: " + entity);
  });
}

export function editFactor(conf, entity, factor) {
  confDeleteEntity(conf, entity);
  conf.industry_factors.push({'entity_codes': [entity], 'factor': factor});

  setConf(conf).then(res => {
    ElMessage.success("Successfully update AdSystem conf! (May needs 15 seconds to finally update)");
  });
};
