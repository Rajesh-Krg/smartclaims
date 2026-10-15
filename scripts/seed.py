#!/usr/bin/env python3
"""Idempotent fictional intake records via the authenticated API."""
import json
import os
from pathlib import Path
import httpx

root = Path(__file__).resolve().parents[1]
identities = json.loads(Path(os.environ.get('DEMO_IDENTITIES_FILE', root/'work/demo-identities.json')).read_text())
token = next(token for token, user in identities.items() if user['subject']=='demo-adjuster')
names = ['Morgan Example','Avery Fiction','Jordan Sample','Taylor Demo','Casey Example','Riley Fiction','Quinn Sample','Alex Demo','Drew Example','Sam Fiction','Jamie Sample','Robin Demo']
vehicles = ['2023 Toyota Camry','2022 Honda Accord','2024 Ford Escape','2021 Subaru Outback']
stages = ['TRIAGE','ASSESSMENT','REPAIR_PLANNING','AUTHORIZATION_PENDING']
with httpx.Client(base_url=os.environ.get('API_URL','http://127.0.0.1:8000'),headers={'Authorization':f'Bearer {token}'}) as client:
    for i,name in enumerate(names):
        data = dict(member_name=name, policy_reference=f'SYN-{10001+i}', vehicle=vehicles[i%4],
                    vin='1HGCM82633A004352', incident_date='2026-10-01', location=f'{100+i} Fictional Lake Street',
                    incident_summary='Synthetic parking incident with cosmetic panel damage. No injuries reported in this fictional scenario.')
        response = client.post('/api/v1/claims',json=data,headers={'Idempotency-Key':f'fixture-v2-{i}'})
        response.raise_for_status()
        claim = response.json()
        for target in stages[:i%5]:
            if claim['status']==target:
                continue
            # Re-running seed preserves already progressed records.
            target_index = stages.index(target)
            current_index = stages.index(claim['status']) if claim['status'] in stages else -1
            if current_index >= target_index:
                continue
            response = client.post(f"/api/v1/claims/{claim['id']}/transitions",json={
                'target':target,'expected_version':claim['version'],'reason':'Synthetic fixture review by configured adjuster'})
            response.raise_for_status()
            claim=response.json()
print('12 synthetic claims verified. No live insurer or partner integrations used.')
